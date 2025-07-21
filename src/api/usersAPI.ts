
import axios from "axios";
const URL: string = "http://localhost:3300/api/v1";

// const URL: string = "https://pick-be.onrender.com/api/v1";

export const getUsers = async () => {
  try {
    return await axios.get(`${URL}/all-user`).then((res) => {
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};

export const getStudios = async () => {
  try {
    return await axios.get(`${URL}/view-all-studio`).then((res) => {
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};

export const getStudiosBookings = async () => {
  try {
    return await axios.get(`${URL}/view-studio-bookings`).then((res) => {
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};

export const getStudiosOwner = async (userID: string) => {
  try {
    return await axios.get(`${URL}/one-user/${userID}`).then((res) => {
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};

export const getStudiosBookingsRevenue = async (studioID: string) => {
  try {
    return await axios
      .get(`${URL}/view-studio-booking/${studioID}`)
      .then((res) => {
        return res.data;
      });
  } catch (error: any) {
    return error.message;
  }
};

export const getStudiosRequestStatus = async (
  payoutID: string,
  status: string
) => {
  try {
    return await axios
      .patch(`${URL}/update-one-payout/${payoutID}`, {
        status,
      })
      .then((res) => {
        return res.data;
      });
  } catch (error: any) {
    return error.message;
  }
};

export const getStudiosPayout = async () => {
  try {
    return await axios.get(`${URL}/read-payout/`).then((res) => {
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};

export const getActivity = async () => {
  try {
    return await axios.get(`${URL}/read-activities/`).then((res) => {
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};

export const banStudio = async (studioID: string) => {
  try {
    return await axios.patch(`${URL}/ban-studio/${studioID}`).then((res) => {
      console.log(res);
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};

export const unbanStudio = async (studioID: string) => {
  try {
    return await axios.patch(`${URL}/unban-studio/${studioID}`).then((res) => {
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};

export const deleteAccount = async (userID: string) => {
  try {
    return await axios.delete(`${URL}/delete-user/${userID}`).then((res) => {
      return res.data;
    });
  } catch (error: any) {
    return error.message;
  }
};
