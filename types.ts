export interface User {
  id: string;
  createdAt: string;
  phoneNumber: string;
  userType: 'USER' | 'TEMP';
  lastSignInTime: string;
  language: string;
  totalSummaries: number;
  previousAnonymousUID?: string;
}
export interface GetUserResponse {
  message: string;
  user: User;
  token: string;
}
export interface CreateTempUserResponse extends GetUserResponse {}
export interface UpdateTempUserResponse extends GetUserResponse {}

export interface OtpVerifPayload {
  phone_number: string;
  otp_code: string;
  temp_uuid?: string;
}
export interface OtpVerifyResponse extends GetUserResponse {}

export interface CreateUserResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface TranslatedSummaryType {
  title: string;
  body: string;
  action: string;
}

export interface SummaryTranslationChannelMessage {
  message: string;
  stage: keyof typeof STAGES | 'error';
  translated_json?: TranslatedSummaryType;
}

export const STAGES: { [key: string]: number } = {
  extracting_text: 1,
  summarizing_text: 2,
  translating_text: 3,
  summary_translation_completed: 4,
};

export interface Summary {
  id?: string;
  createdAt: Date;
  language: string;
  userId: string;
  summaryAction: string;
  summaryBody: string;
  summaryTitle: string;
  imageName: string;
  tokenUsed: string;
}

export interface SummaryResponse extends Summary {}

// export interface Summary {
//   created_at: string;
//   extracted_text: string;
//   id: number;
//   original_action: string;
//   original_body: string;
//   original_language: string | null;
//   original_title: string;
//   translated_action: string;
//   translated_body: string;
//   translated_title: string;
//   translation_language: string;
//   updated_at: string;
//   user_id: number;
// }
export interface ErrorResponse {
  message?: string;
}
