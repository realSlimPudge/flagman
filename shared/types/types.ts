//Основное
export type User = {
  ID: number;
  FullName: string;
  Email: string;
  PassHash: string;
  CreatedAt: string;
  PhoneNumber: string;
  Organizations: Organization[];
  SentDocuments: Document[];
  ReceivedDocuments: DocumentRecipient[];
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
export type Document = {
  ID: string;
  Title: string;
  Status: string;
  SenderID: string;
  Sender: User;
  CreatedAt: string;
  UpdatedAt: string;
};
export type DocumentRecipient = {
  ID: string;
  DocumentID: string;
  UserID: string;
  Status: string;
  Signature: string;
  SignedAt: string;
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
