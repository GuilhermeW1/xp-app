export function emailValidate (email: string): boolean {
  const tester = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!email) {
    return false;
  }
  if (email.length > 256) {
    return false;
  }
  if (!tester.test(email)) {
    return false;
  }
  const [account, address] = email.split('@');
  if (account.length > 64) {
    return false;
  }
  const domainParts = address.split('.');
  if (domainParts.some(function (part) {
    return part.length > 63;
  })) {
    return false;
  }
  return true;
}

export function passwordValidate(password: string, passwordEquals: string): boolean | string{
  if(password !== passwordEquals){
    return 'As senhas não são iguais';
  }
  if(password.length < 8){
    return 'A senha deve ter no minimo 8 digitos';
  }
  return true;
}
