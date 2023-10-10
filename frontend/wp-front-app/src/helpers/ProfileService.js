import axiosService from "../helpers/axios";

// 프로필 정보를 업데이트하는 함수
export async function updateProfile(profileData, imageFile) {
  try {
    // 프로필 정보와 이미지 파일을 업로드할 FormData 객체 생성
    const formData = new FormData();
    formData.append("nickname", profileData.nickname);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // 백엔드 API 엔드포인트에 맞게 URL 수정
    const response = await axiosService.post("/account/profile/current/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}