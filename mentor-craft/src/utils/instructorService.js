import API from '../api';
import { getAccessToken } from '../contexts/authUtils';

export const fetchInstructorAnalytics = async () => {
  const token = getAccessToken();
  const response = await API.get('instructor/analytics/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
