import useSWR from 'swr';
import {
  getActivity,
  getStudios,
  getStudiosBookings,
  getStudiosBookingsRevenue,
  getStudiosOwner,
  getStudiosPayout,
  getUsers,
} from "../api/usersAPI";

export const useReadUsers = () => {
  const { data } = useSWR(`/get-users/`, () => {
    return getUsers().then((res: any) => {
      return res.data;
    });
  });

  return { data };
};

export const useReadStudios = () => {
  const { data: studios } = useSWR(`/view-all-studios/`, () => {
    return getStudios().then((res: any) => {
      return res.data;
    });
  });

  return { studios };
};

export const useReadStudiosBookings = () => {
  const { data: bookings } = useSWR(`/view-studio-bookings/`, () => {
    return getStudiosBookings().then((res: any) => {
      return res.data;
    });
  });

  return { bookings };
};

export const useReadStudiosOwner = (userID: string) => {
  const { data: user } = useSWR(`/owner/${userID}`, () => {
    return getStudiosOwner(userID).then((res: any) => {
      return res.data;
    });
  });

  return { user };
};

export const useReadStudiosRevenue = (userID: string) => {
  const { data: studioRevenue } = useSWR(
    `/view-studio-booking/${userID}`,
    () => {
      return getStudiosBookingsRevenue(userID).then((res: any) => {
        return res.data;
      });
    }
  );

  return { studioRevenue };
};

export const useReadStudiosPayout = () => {
  const { data: payout, mutate } = useSWR(`/view-studio-payout`, () => {
    return getStudiosPayout().then((res: any) => {
      return res.data;
    });
  });

  return { payout, mutate };
};

export const useReadActivities = () => {
  const { data: activities, mutate } = useSWR(`/view-activities`, () => {
    return getActivity().then((res: any) => {
      return res.data;
    });
  });

  return { activities, mutate };
};
