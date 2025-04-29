import { fetchAuthSession } from "aws-amplify/auth";


export async function getUserName() {
    const userInfo = await fetchAuthSession();
  
    return userInfo.tokens?.idToken?.payload.preferred_username;
  }
  