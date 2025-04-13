import { EnterpriseSchema } from "../schmas/enterprise";
import * as yup from "yup";

//Основное
export type User = {
  ID: number;
  FullName: string;
  Email: string;
  PassHash: string;
  CreatedAt: string;
  PhoneNumber: string;
  Enterprises: Enterprise[];
  Departments: Department[];
  SentDocuments: Document[];
  ReceivedDocuments: DocumentRecipient[];
};
export type Enterprise = {
  ID: number;
  Name: string;
  Description: string;
  CreatorID: number;
  CreatedAt: string;
  UpdatedAt: string;
  Users: User[];
  Departments: Department[];
};
export type Department = {
  ID: number;
  Name: string;
  RoleID: number;
  EnterpriseID: number;
  Users: User[];
  Role: Role;
  CreatedAt: string;
  UpdatedAt: string;
};
export type Role = {
  ID: number;
  Name: string;
  Permissions: string;
};
export type UserDepartment = {
  UserID: number;
  DepartmentID: number;
  CreatedAt: string;
  UpdatedAt: string;
  User: User;
  Department: Department;
};
export type Document = {
  ID: number;
  Title: string;
  FilePath: string;
  Status: string;
  SenderID: number;
  Sender: User;
  CreatedAt: string;
  UpdatedAt: string;
};

export type DocumentRecipient = {
  ID: number;
  DocumentID: number;
  Document: Document;
  UserID: number;
  Status: string;
  Signature: string;
  SignedAt: string;
};
export type Invitation = {
  ID: number;
  Email: string;
  Description: string;
  CreatorID: number;
  CreatedAt: string;
  UpdatedAt: string;
  Users: User;
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
export type EnterpriseForm = yup.InferType<typeof EnterpriseSchema>;
