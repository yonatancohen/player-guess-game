import { HttpHeaders } from "@angular/common/http";

export function getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
}

export function getClienteaders(uid: string): HttpHeaders {
    return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `UID ${uid}`
    });
}
