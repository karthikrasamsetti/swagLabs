// @ts-check
const { test, expect } = require('@playwright/test');
require("dotenv").config();
// @ts-ignore
const faker = require('faker');
// const testData= require('../data/userData.json');
// // @ts-ignore
// const { myFixture } = require('./myFixture');
var authToken;
var selectedBookingId;
test.beforeAll('login with valid credentials', async ({ request }) => {

  const response = await request.post(`${process.env.apiBaseURL}/auth`, {

   data:{
    username:process.env.user,
    password: process.env.password,
   }
  });
  // expect(response.ok()).toBeTruthy()
  if (response.status() === 200) {
    const responseBody = await response.json();

    if (responseBody && responseBody.token) {
       authToken = responseBody.token;
      console.log('Logged in successfully. Auth token:', authToken);
    } else {
      console.error('Token not found in the response:', responseBody);
    }
  } else {
    console.error('Login failed. Status code:', response.status());
    const responseBody = await response.json();
    console.error('Error message:', responseBody.reason);
  }
});

test.beforeEach('Get all booking IDs', async ({ request }) => {
  const response = await request.get(`${process.env.apiBaseURL}/booking`);

  if (response.status() === 200) {
    const bookingData = await response.json();
    const bookingIds = bookingData.map((booking) => booking.bookingid);

    const randomIndex = Math.floor(Math.random() * bookingIds.length);
    selectedBookingId = bookingIds[randomIndex];
  } else {
    console.error('Failed to retrieve booking data. Status code:', response.status());
  }
});

test('Create a Booking', async ({ request }) => {
    const requestData = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      totalprice: faker.datatype.number(),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: faker.date.past().toISOString(),
        checkout: faker.date.future().toISOString(),
      },
      additionalneeds: faker.random.words(),
    };
  
    const response = await request.post(`${process.env.apiBaseURL}/booking`, {
      data: requestData,
    });
    console.log("Requested Data  :",requestData)
    if (response.status() === 200) {
      const responseBody = await response.json();
      console.log('Booking created successfully. Response:', responseBody);
      console.log('Expected firstname:', requestData.firstname);
      expect(responseBody.booking.firstname).toBe(requestData.firstname);
      expect(responseBody.booking.lastname).toBe(requestData.lastname);
      expect(responseBody.booking.totalprice).toBe(requestData.totalprice);
      expect(responseBody.booking.depositpaid).toBe(requestData.depositpaid);
  
    } else {
      console.error('Failed to create a booking. Status code:', response.status());
    }
  });

test('Update Booking Data', async ({ request }) => {
  console.log("***********", selectedBookingId);
  if (selectedBookingId) {
    console.log("Selected Booking ID:", selectedBookingId);

    const bookingId = selectedBookingId;

    const updatedData = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      totalprice: faker.datatype.number(),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: faker.date.past().toISOString(),
        checkout: faker.date.future().toISOString(),
      },
      additionalneeds: faker.random.words(),
    };

    const putResponse = await request.put(`${process.env.apiBaseURL}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${authToken}`,
      },
      data: updatedData,
    });

    if (putResponse.status() === 200) {

      const responseBody = await putResponse.json();
      console.log('Booking updated successfully. Response:', responseBody);

      expect(responseBody.firstname).toBe(updatedData.firstname);
      expect(responseBody.lastname).toBe(updatedData.lastname);
      expect(responseBody.totalprice).toBe(updatedData.totalprice);
      expect(responseBody.depositpaid).toBe(updatedData.depositpaid);
      expect(responseBody.additionalneeds).toBe(updatedData.additionalneeds);
        // expect(formattedCheckin).toBe(formattedCheckinExpected);

      // Function to format a date as a string

      // function formatDate(date, timeZone) {
      //   const options = {
      //     year: 'numeric',
      //     month: '2-digit',
      //     day: '2-digit',
      //     hour: '2-digit',
      //     minute: '2-digit',
      //     second: '2-digit',
      //     hour12: true,
      //     timeZoneName: 'short',
      //   };
      //   // @ts-ignore
      //   const formatter = new Intl.DateTimeFormat('en-US', options);
      //   if (timeZone) {
      //     options.timeZone = timeZone;
      //   }
      //   return formatter.format(new Date(date));
      // }


      // Format the dates and then compare
      // const formattedCheckin = formatDate(responseBody.bookingdates.checkin);
      // const formattedCheckinExpected = formatDate(updatedData.bookingdates.checkin);

    } else {
      console.error('Failed to update the booking. Status code:', putResponse.status());
    }
  } else {
    console.error('Selected Booking ID is not defined.');
  }
});

test('Getting specific booking based upon the booking id provided',async ({request})=>{
 const id= selectedBookingId;
 console.log(id)
  const response = await request.get(`${process.env.apiBaseURL}/booking/${id}`);
  console.log("**********************",response.status())
  if (response.status() === 200) {
    const bookingData = await response.json();
    console.log(bookingData)
  }
  else{
    console.error('Failed to retrieve booking data. Status code:', response.status());
  }
})


test.afterAll('Delete Booking', async ({ request }) => {
  console.log(selectedBookingId)
  const bookingId = selectedBookingId;
  const response = await request.delete(`${process.env.apiBaseURL}/booking/${bookingId}`, {
    headers: {
      Cookie : `token=${authToken}`,
    }
  });

  if (response.status() === 201) {
    console.log('Booking deleted successfully.');
  } else {
    console.error('Failed to delete the booking. Status code:', response.status());
  }
});