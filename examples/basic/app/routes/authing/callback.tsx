import { createCallbackLoader } from '@authing/remix';
import { sessionStorage } from '~/services/session.server';
import { appDomain, clientId, clientSecret } from '~/config.server';

export const loader = createCallbackLoader({
  appDomain,
  clientId,
  clientSecret,
  // 登录失败返回登录页
  failureRedirect: '/error',
  // 跳转到 /user 接口去记录数据库用户
  successRedirect: '/user',
  sessionStorage
});
