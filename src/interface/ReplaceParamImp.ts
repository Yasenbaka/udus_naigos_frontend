export interface ReplaceParamImp {
  token: tokenImp;
  target: targetImp;
}
interface tokenImp {
  isHave: boolean;
  value: string | null;
}
interface targetImp {
  isHave: boolean;
  value: string | null;
}
