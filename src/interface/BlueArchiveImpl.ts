export interface BaStudentImpl{
  id: string;
  cn_name: string;
  jp_name: string | null;
  kr_name: string | null;
  en_name: string | null;
  introduce: string | null;
  avatar_square: string;
  avatar_rectangle: string;
  body_image: string;
  school: string;
  club: string;
}
export interface BaSchoolImpl{
  id: string;
  cn_name: string;
  jp_name: string | null;
  kr_name: string | null;
  en_name: string | null;
  introduce: string | null;
  logo: string;
  beautify_logo: string | null;
  bg: string | null;
}
export interface BaSchoolClubImpl{
  id: string;
  school: string;
  cn_name: string;
  jp_name: string | null;
  kr_name: string | null;
  en_name: string | null;
  logo: string | null;
  bg: string | null;
}
