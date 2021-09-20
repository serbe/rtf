import { Dispatch, SetStateAction } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

import { User } from '../models/user';

export const getStorage = (): User => {
  const userStorage: string | null = localStorage.getItem("user");
  const user: User = { role: 0, name: "", token: "" };
  if (userStorage) {
    const u: User | undefined = JSON.parse(userStorage);
    if (u) {
      user.name = u.name;
      user.role = u.role;
      user.token = u.token;
    }
  }
  return user;
};

export const setStorage = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearStorage = (): void => {
  localStorage.removeItem("user");
};

export const checkStorage = (
  setChecker: Dispatch<SetStateAction<boolean>>,
  setLogin: Dispatch<SetStateAction<boolean>>,
  sendJsonMessage: SendJsonMessage
): void => {
  const user = getStorage();

  sendJsonMessage(`{ "t": "${user.token}", "r": ${user.role} }`);
};

// .then((jsonData) => {
//   if (jsonData.data.r) {
//     setLogin(true);
//     setChecker(true);
//   } else {
//     setLogin(false);
//     setChecker(true);
//   }
// });
