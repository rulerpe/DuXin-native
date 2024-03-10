export interface User {
  id: number;
  email: string;
  password_digest: string;
  created_at: Date;
  updated_at: Date;
  username: string;
  phone_number: string;
  verified: boolean;
  failed_attempts: number;
  locked_at: string;
  user_type: 'USER' | 'TEMP';
  document_count: number;
  language: string;
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
  created_at: string;
  extracted_text: string;
  id: number;
  original_action: string;
  original_body: string;
  original_language: string | null;
  original_title: string;
  translated_action: string;
  translated_body: string;
  translated_title: string;
  translation_language: string;
  updated_at: string;
  user_id: number;
}
export interface ErrorResponse {
  message?: string;
}
