const { test, expect } = require("@playwright/test");

const bookingData = require("../data/bookingdetails.json");

const updatedData = require("../data/updatedBookingDetails.json");

const patchData = require("../data/patchdetails.json");

const statusCode = require("../data/statuscodes.json");

require("dotenv").config();

var token;

var id;

test("get the token", async ({ request }) => {
  const response = await request.post(`${process.env.apiBaseURL}/auth`, {
    data: {
      username: process.env.user,

      password: process.env.password,
    },
  });

  const responseBody = await response.json();

  token = await responseBody.token;

  console.log(await token);

  expect(response.status()).toBe(statusCode.success);
});

test("Getting all the booking ids", async ({ request }) => {
  const response = await request.get(`${process.env.apiBaseURL}/booking`);

  const responseBody = await response.json();

  console.log(responseBody);

  expect(response.status()).toBe(statusCode.success);

  expect(response.ok()).toBeTruthy();
});

test("Posting the booking details", async ({ request }) => {
  const response = await request.post(`${process.env.apiBaseURL}/booking`, {
    data: bookingData,
  });

  expect(response.status()).toBe(statusCode.success);

  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();

  console.log(responseBody.bookingid);

  id = responseBody.bookingid;

  expect(responseBody.booking).toHaveProperty(
    "firstname",
    bookingData.firstname
  );

  expect(responseBody.booking).toHaveProperty("lastname", bookingData.lastname);

  expect(responseBody.booking).toHaveProperty(
    "totalprice",

    bookingData.totalprice
  );

  expect(responseBody.booking).toHaveProperty(
    "depositpaid",

    bookingData.depositpaid
  );
});


test("Getting details of an user based on id", async ({ request }) => {
  const response = await request.get(`${process.env.apiBaseURL}/booking/${id}`);

  const responseBody = await response.json();

  console.log(responseBody);

  expect(response.status()).toBe(statusCode.success);

  expect(response.ok()).toBeTruthy();
});

test("Update the booking details", async ({ request }) => {
  const response = await request.put(
    `${process.env.apiBaseURL}/booking/${id}`,
    {
      headers: { Cookie: `token=${token}` },

      data: updatedData,
    }
  );

  expect(response.ok()).toBeTruthy();

  expect(response.status()).toBe(statusCode.success);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty("firstname", updatedData.firstname);

  expect(responseBody).toHaveProperty("lastname", updatedData.lastname);
});

test("Update the paticular fields in booking details", async ({ request }) => {
  const response = await request.patch(
    `${process.env.apiBaseURL}/booking/${id}`,
    {
      headers: { Cookie: `token=${token}` },

      data: patchData,
    }
  );

  console.log(await response.json());

  expect(response.ok()).toBeTruthy();

  expect(response.status()).toBe(statusCode.success);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty("firstname", patchData.firstname);

  expect(responseBody).toHaveProperty("lastname", patchData.lastname);
});

test("Delete the booking details", async ({ request }) => {
  const response = await request.delete(
    `${process.env.apiBaseURL}/booking/${id}`,
    {
      headers: { Cookie: `token=${token}` },
    }
  );

  expect(response.status()).toBe(statusCode.created);
});
