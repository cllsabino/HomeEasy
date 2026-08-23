import { ServiceRequestField } from '../shared/models/service-request-field';

export class Servico {
    nome? : string;
    tipo? : string;
    id? : string;
    available? : boolean;
    requestForm? : ServiceRequestField[];
    basePrice? : number;
    description? : string;
}
