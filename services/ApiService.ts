import axios, { AxiosError, AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';

import {
  User,
  Summary,
  GetUserResponse,
  CreateTempUserResponse,
  OtpVerifPayload,
  OtpVerifyResponse,
  CreateUserResponse,
  UpdateTempUserResponse,
  LogoutResponse,
  ErrorResponse,
  SummaryResponse,
} from '../types';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({});
    if (Platform.OS !== 'web') {
      this.initializeRequestInterceptor();
    }
    this.initializeResponseInterceptor();
  }

  private async setAuthToken(token: string): Promise<void> {
    if (Platform.OS === 'web') return; // Skip for web
    await SecureStore.setItemAsync('auth_token', token);
  }

  private async getAuthToken(): Promise<string | null> {
    if (Platform.OS === 'web') return null; // Skip for web
    return await SecureStore.getItemAsync('auth_token');
  }

  private async removeAuthToken(): Promise<void> {
    if (Platform.OS === 'web') return; // Skip for web
    await SecureStore.deleteItemAsync('auth_token');
  }

  private handleAxiosError(error: AxiosError) {
    let errorMessage = '';
    if (error.response) {
      if (error.response.status !== 401) {
        errorMessage = (error.response.data as ErrorResponse).message || 'serverError';
      }
    } else if (error.request) {
      errorMessage = 'networkError';
    } else {
      errorMessage = 'requestError';
    }
    if (errorMessage) {
      Toast.show({
        type: 'error',
        text1: errorMessage,
      });
    }
  }

  private async initializeRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        console.log('requesting: ', config.url);
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }
  private async initializeResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleAxiosError(error);
        return Promise.reject(error);
      },
    );
  }

  public async fetchImageSummary(base64Image: string, language: string): Promise<SummaryResponse> {
    const firebaseFunctionUrl = __DEV__
      ? 'http://10.0.2.2:5001/duxin-app/us-central1/getImageSummary'
      : 'https://us-central1-duxin-app.cloudfunctions.net/getImageSummary';
    const payload = {
      image: base64Image,
      language,
    };
    const response = await this.axiosInstance.post<SummaryResponse>(firebaseFunctionUrl, payload);
    return response.data;
  }

  //   // get current user based on token
  //   public async fetchCurrentUser(): Promise<GetUserResponse> {
  //     const response = await this.axiosInstance.get<GetUserResponse>(`/user_data`);
  //     return response.data;
  //   }

  //   // Start creating new user with phone number,
  //   // trigger back send OTP code to phone number.
  //   public async createUser(phoneNumber: string, language: string): Promise<CreateUserResponse> {
  //     const createUserUrl = `/users`;
  //     const payload = {
  //       user: { phone_number: phoneNumber, language: language },
  //     };
  //     const response = await this.axiosInstance.post<CreateUserResponse>(createUserUrl, payload);
  //     return response.data;
  //   }

  //   // Verify OTP code to finish creating user
  //   public async otpVerify(
  //     phoneNumber: string,
  //     otpCode: string,
  //     tempUser: User | null,
  //   ): Promise<OtpVerifyResponse> {
  //     const otpVerifyUrl = `/otp/verify`;
  //     const payload: OtpVerifPayload = {
  //       phone_number: phoneNumber,
  //       otp_code: otpCode,
  //     };
  //     if (tempUser?.user_type === 'TEMP') {
  //       payload.temp_uuid = tempUser.phone_number;
  //     }
  //     const response = await this.axiosInstance.post<OtpVerifyResponse>(otpVerifyUrl, payload);
  //     const { token } = response.data;
  //     await this.setAuthToken(token);
  //     return response.data;
  //   }

  //   public async createTempUser(language: string): Promise<CreateTempUserResponse> {
  //     const tempUserUrl = `/temp_user`;
  //     const tempUserId = uuid.v4();
  //     const payload = {
  //       user: { phone_number: tempUserId, language: language },
  //     };
  //     const response = await this.axiosInstance.post<CreateTempUserResponse>(tempUserUrl, payload);
  //     const { token } = response.data;
  //     await this.setAuthToken(token);
  //     return response.data;
  //   }

  //   public async updateUserLanguage(language: string): Promise<UpdateTempUserResponse> {
  //     const updateUserUrl = `/user_data`;
  //     const payload = {
  //       user: { language: language },
  //     };
  //     const response = await this.axiosInstance.put<UpdateTempUserResponse>(updateUserUrl, payload);
  //     return response.data;
  //   }

  //   public async logout(): Promise<LogoutResponse> {
  //     const logoutUrl = `/logout`;
  //     const response = await this.axiosInstance.delete<LogoutResponse>(logoutUrl);
  //     await this.removeAuthToken();
  //     return response.data;
  //   }

  //   public async fetchSummaries(page: number): Promise<Summary[]> {
  //     const summaryUrl = `/summary_translations?page=${page}`;
  //     const response = await this.axiosInstance.get<Summary[]>(summaryUrl);
  //     return response.data;
  //   }

  //   public async deleteSummary(summaryId: number): Promise<string> {
  //     const summaryUrl = `/summary_translations/${summaryId}`;
  //     const response = await this.axiosInstance.delete<string>(summaryUrl);
  //     return response.data;
  //   }

  //   public async uploadImage(payload: FormData): Promise<any> {
  //     const uploadImageUrl = `/upload_image`;
  //     const config = {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     };
  //     const response = await this.axiosInstance.post<any>(uploadImageUrl, payload, config);
  //     return response.data;
  //   }
}

//@ts-ignore
export default new ApiService();
