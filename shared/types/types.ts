//Основное
export type User = {
  ID: string;
  FullName: string;
  Email: string;
  PassHash: string;
  CreatedAt: string;
  PhoneNumber: string;
  Organizations: Organization[];
};
export type Organization = {
  ID: string;
  Name: string;
  CreatorID: string;
  Departments: Department[];
};
export type Department = {
  ID: string;
  Name: string;
  OrganizationID: string;
  Permissions: string;
};
//Авторизация
export type Register = {
  email: string;
  fullname: string;
  phonenumber: string;
  password: string;
};
export type Login = {
  email: string;
  password: string;
};
