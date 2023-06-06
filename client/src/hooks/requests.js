const API_URL = "http://localhost:8000/v1";

/**
 * Load planets and return as JSON.
 * @returns response as json
 */
const httpGetPlanets = async () => {
  const res = await fetch(`${API_URL}/planets`);
  const responseAsJSON = await res.json();
  return responseAsJSON;
};

/**
 * Load launches, sort by flight number, and return as JSON.
 * @returns repsone as json
 */
const httpGetLaunches = async () => {
  const res = await fetch(`${API_URL}/launches`);
  const responseAsJSON = await res.json();
  return responseAsJSON.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
};

/**
 * Submit given launch data to launch system.
 */
const httpSubmitLaunch = async (launch) => {
  try {
    const res = await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
    return res;
  } catch (err) {
    return {
      ok: false,
    };
  }
};

/**
 *  Delete launch with given ID.
 */
const httpAbortLaunch = async (id) => {
  try {
    const res = await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });

    return res;
  } catch (err) {
    console.log(err);
    // res.ok is normally not set at the client hook
    // so in case of network error, we need to set ok to false
    // to match the case of network failure.
    return {
      ok: false,
    };
  }
};

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
