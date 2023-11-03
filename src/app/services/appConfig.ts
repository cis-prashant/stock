export class AppConfig {
    public static API_URL = window.location.hostname == 'localhost'?'http://localhost:3000/':window.location.protocol+'//'+window.location.host+'/';
}

