import { API } from "@api";

export function getFullname(user) {
  return user.full_name || "";
}

export function getShortname(user) {
  const fullname = getFullname(user);
  return fullname.substring(0, 2);
}

export function getAvatarSrc(user) {
  return user.avatar ? `${API.FILE}/${user.avatar}` : "";
}
