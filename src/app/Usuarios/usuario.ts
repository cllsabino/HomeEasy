export enum ProfessionalVerificationStatus {
    NotSubmitted = 'notSubmitted',
    Pending = 'pending',
    Verified = 'verified',
    Rejected = 'rejected'
}

export enum UserRole {
    User = 'user',
    Admin = 'admin'
}

export class Usuario {
    email? : string;
    senha? : string;
    nome? : string;
    idade? : number;
    telefone? : string;
    id? : string;
    foto? : string;
    endereco? : string;
    estado? : string;
    cidade? : string;
    cpf? : number | string;
    cnpj? : number | string;
    instagram? : string;
    facebook? : string;
    twitter? : string;
    site? : string;
    linkedIn? : string;
    availableForService? : boolean;
    verificationStatus? : ProfessionalVerificationStatus;
    verificationRequestedAt? : any;
    verificationReviewedAt? : any;
    verificationReviewedBy? : string;
    verificationReviewNote? : string;
    role? : UserRole;
}
