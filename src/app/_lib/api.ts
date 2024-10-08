import { throttle } from "lodash";
import { SubmitHandler } from "react-hook-form";

import { encrypt } from "@/utils/modules";

// 마커 위치 정보들을 가져오는 함수
export const getMarkerInfo = async (params: GetMarkerParam) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/records/markers?sw_lat=${params.swLat}&sw_lng=${params.swLng}&ne_lat=${params.neLat}&ne_lng=${params.neLng}`);
  if (!res.ok) {
    throw new Error('Failed to get markerinfo');
  }
  return res.json();
}

// 위도/경도에 해당하는 위치의 주소 정보를 가져오는 함수
export const getAddress = async (lat: string, lng: string) => {
  const url = 'https://dapi.kakao.com/v2/local/geo/coord2address.json';
  const headerAuthorization = `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`
  const res = await fetch(`${url}?x=${lng}&y=${lat}`, {
    headers: {
      'Authorization': headerAuthorization
    }
  });
  if (!res.ok) {
    throw new Error('Failed to get address information');
  }
  return res.json();
}

// 주소 기반의 건물 정보를 가져오는 함수
export const getBuildingInfo = async (address: string) => {
  const url = 'https://dapi.kakao.com/v2/local/search/address';
  const headerAuthorization = `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`
  const res = await fetch(`${url}?query=${address}`, {
    headers: {
      'Authorization': headerAuthorization
    }
  });
  if (!res.ok) {
    throw new Error('Failed to get building information');
  }
  return res.json();
}

// 실시간 인기 공간기록을 가져오는 함수
export const getTopRecords = async (limit: number) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/records/top?limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

// 위치에 따른 공간기록 데이터를 가져오는 함수
export const getRecords = async (lat: string, lng: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/records?lat=${lat}&lng=${lng}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

// 추천 검색어 요청
export const getSearchSuggestions = async (keyword: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/search/suggestions?q=${encodeURIComponent(keyword)}`, { 'cache': 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
};

// 검색 결과 요청
export const getSearchResults = async (keyword: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/search?q=${encodeURIComponent(keyword)}`, { 'cache': 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
};

// 실시간 인기 공간지식을 가져오는 함수
export const getTopKnowledges = async (limit: number) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/knowledges/top?limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to get top knowledges');
  }
  return res.json();
}

// 공간지식 전체 목록 가져오는 함수
export const getKnowledges = async () => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/knowledges`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to get knowledges');
  }
  return res.json();
}

// 공간지식 상세 데이터를 가져오는 함수
export const getKnowledge = async (knowledgeId: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/knowledges/${knowledgeId}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to get knowledge info');
  }
  return res.json();
}

// 공간기록 좋아요/싫어요 요청 함수
export const postRecordReaction = async (postId: string, kind: 'like' | 'dislike') => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const uri = `${domain}/api/records/${postId}/reactions?kind=${kind}`;
  const res = await fetch(uri, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to get knowledge info');
  }
  return res.json();
}

// 공간지식 좋아요/싫어요 요청 함수
export const postKnowledgeReaction = async (knowledgeId: string, kind: 'like' | 'dislike') => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const uri = `${domain}/api/knowledges/${knowledgeId}/reactions?kind=${kind}`;
  const res = await fetch(uri, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to get knowledge info');
  }
  return res.json();
}

// 회원가입 요청 함수
export const postSignup = async ({ email, name, nickname, phone_number }: SignupType) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const uri = `${domain}/api/users?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&nickname=${encodeURIComponent(nickname)}&phone_number=${encodeURIComponent(phone_number)}`;
  const res = await fetch(uri, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to get knowledge info');
  }
  return res.json();
}

// 회원탈퇴 요청 함수
export const deleteUser = async (userId: string | undefined) => {
  if (!userId) {
    return alert('이미 탈퇴한 유저이거나 알 수 없는 이유로 회원탈퇴가 불가능합니다.\n고객센터에 문의부탁드립니다.');
  }
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const uri = `${domain}/api/users/${userId}`;
  const res = await fetch(uri, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Failed to get knowledge info');
  }
  return res.json();
}

// 마이페이지 내 정보 요청
export async function getProfileInfo() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/profile/info`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

// 마이페이지 공간기록 목록 요청
export async function getProfileRecord() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/profile/record`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

// 마이페이지 공간기록 상세 요청
export async function getProfileRecordDetail(recordId: string) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/profile/record/${recordId}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

// 마이페이지 공간기록 제거 요청
export async function deleteRecord(recordId: string) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/profile/record/${recordId}`, {
    method: 'DELETE',
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

// 마이페이지 공간지식 목록 요청
export async function getProfileKnowledges() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/profile/knowledges`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

// 마이페이지 공간지식 목록 요청
export async function getProfileKnowledgeDetail(knowledgeId: string) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/profile/knowledges/${knowledgeId}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

// 마이페이지 공간지식 제거 요청
export async function deleteKnowledge(knowledgeId: string) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/profile/knowledges/${knowledgeId}`, {
    method: 'DELETE',
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

// 관리자 로그인 요청
export const postLogin: SubmitHandler<FormInputs> = throttle(async (data) => {
  if (!data.id) {
    return alert('아이디를 입력해주세요.');
  } else if (!data.password) {
    return alert('비밀번호를 입력해주세요.');
  }
  try {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const res = await fetch(`${domain}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: encrypt(data.id, process.env.NEXT_PUBLIC_AES_ID_SECRET_KEY),
        password: encrypt(data.password, process.env.NEXT_PUBLIC_AES_PW_SECRET_KEY)
      })
    });
    if (!res.ok) {
      return alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    } else {
      window.location.reload();
    }
  } catch (err) {
    console.error('로그인 실패', err);
    alert('로그인에 실패하였습니다. 잠시 후 다시 시도해주세요.');
  }
}, 2000);

// 관리자 로그아웃 요청
export const postLogout = async () => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const res = await fetch(`${domain}/api/admin/logout`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to logout');
  }
  return res.status;
};

// 사용자 정보 요청(관리자)
export const getUserSearchAdmin = async (userName: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  try {
    const res = await fetch(`${domain}/api/admin/search/users?username=${encodeURIComponent(userName)}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch user data');
    }
    return res.json();
  } catch (err) {
    console.error('유저 정보 데이터 페칭 실패', err);
  }
}

// 공간기록 목록 검색 요청(관리자)
export const getRecordSearchAdmin = async (address: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  try {
    const res = await fetch(`${domain}/api/admin/search/record?address=${encodeURIComponent(address)}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch record data');
    }
    return res.json();
  } catch (err) {
    console.error('공간기록 데이터 페칭 실패', err);
  }
}

// 공간기록 제거 요청(관리자)
export const deleteRecordAdmin = async (recordId: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  try {
    const res = await fetch(`${domain}/api/admin/record/${recordId}`, {
      method: 'DELETE',
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error('Failed to delete record');
    }
    return res.json();
  } catch (err) {
    console.error('공간기록 제거 실패', err);
  }
}

// 공간지식 목록 검색 요청(관리자)
export const getKnowledgeSearchAdmin = async (title: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  try {
    const res = await fetch(`${domain}/api/admin/search/knowledges?title=${encodeURIComponent(title)}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch knowledge data');
    }
    return res.json();
  } catch (err) {
    console.error('공간지식 데이터 페칭 실패', err);
  }
}

// 공간지식 제거 요청(관리자)
export const deleteKnowledgeAdmin = async (knowledgeId: string) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  try {
    const res = await fetch(`${domain}/api/admin/knowledges/${knowledgeId}`, {
      method: 'DELETE',
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error('Failed to delete knowledge');
    }
    return res.json();
  } catch (err) {
    console.error('공간지식 제거 실패', err);
  }
}

interface GetMarkerParam {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

interface SignupType {
  email: string;
  name: string;
  nickname: string;
  phone_number: string;
}

interface FormInputs {
  id: string;
  password: string;
}
