const axios = require('axios');
const fetch = require('node-fetch');

const COGNITO_URL = 'https://cognito-idp.ap-southeast-1.amazonaws.com/';
const CLIENT_ID = '6gnaj30oomhtl0t3qtkfp2uir9';

class IDNAuth {
    constructor() {
        this.tokens = {
            accessToken: null,
            idToken: null,
            refreshToken: null
        };
    }

    async login(username, password) {
        const response = await fetch(COGNITO_URL, {
            method: 'POST',
            headers: {
                'host': 'cognito-idp.ap-southeast-1.amazonaws.com',
                'origin': 'https://connect.idn.media',
                'referer': 'https://connect.idn.media/',
                'user-agent': 'Mozilla/5.0',
                'content-type': 'application/x-amz-json-1.1',
                'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth',
                'x-amz-user-agent': 'aws-amplify/5.0.4 js'
            },
            body: JSON.stringify({
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: CLIENT_ID,
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password
                }
            })
        });

        const result = await response.json();
        if (result.AuthenticationResult) {
            this.tokens = {
                accessToken: result.AuthenticationResult.AccessToken,
                idToken: result.AuthenticationResult.IdToken,
                refreshToken: result.AuthenticationResult.RefreshToken
            };
            return result;
        }

        throw new Error('Login gagal: tidak ada AuthenticationResult');
    }

    clearTokens() {
        this.tokens = {
            accessToken: null,
            idToken: null,
            refreshToken: null
        };
    }

    get accessToken() {
        return this.tokens.accessToken;
    }

    get refreshToken() {
        return this.tokens.refreshToken;
    }

    get idToken() {
        return this.tokens.idToken;
    }
}

async function globalSignOut(accessToken) {
    try {
        await axios.post(COGNITO_URL, { AccessToken: accessToken }, {
            headers: {
                'host': 'cognito-idp.ap-southeast-1.amazonaws.com',
                'origin': 'https://connect.idn.media',
                'referer': 'https://connect.idn.media/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'content-type': 'application/x-amz-json-1.1',
                'x-amz-target': 'AWSCognitoIdentityProviderService.GlobalSignOut',
                'x-amz-user-agent': 'aws-amplify/5.0.4 js'
            }
        });
        return { success: true, message: 'Logout global berhasil' };
    } catch {
        return { success: false, message: 'Logout global gagal' };
    }
}

async function revokeToken(refreshToken) {
    try {
        await axios.post(COGNITO_URL, {
            Token: refreshToken,
            ClientId: CLIENT_ID
        }, {
            headers: {
                'host': 'cognito-idp.ap-southeast-1.amazonaws.com',
                'origin': 'https://connect.idn.media',
                'referer': 'https://connect.idn.media/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'content-type': 'application/x-amz-json-1.1',
                'x-amz-target': 'AWSCognitoIdentityProviderService.RevokeToken',
                'x-amz-user-agent': 'aws-amplify/5.0.4 js'
            }
        });
        return { success: true, message: 'Revoke token berhasil' };
    } catch {
        return { success: false, message: 'Revoke token gagal' };
    }
}

module.exports = async (req, res) => {
    // ⭐️ Allow CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Hanya mendukung metode POST' });
    }

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password diperlukan' });
    }

    const auth = new IDNAuth();

    try {
        await auth.login(username, password);

        const ssoResponse = await fetch('https://mobile-api.idn.app/v3.2/idn-account/login-by-sso', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'access-token': auth.accessToken,
                'Authorization': `Bearer ${auth.idToken}`,
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Host': 'mobile-api.idn.app',
                'Origin': 'https://www.idn.app',
                'Referer': 'https://www.idn.app/',
                'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'X-API-Key': '1ccc5bc4-8bb4-414c-b524-92d11a85a818'
            },
            body: '{}'
        });

        const ssoResult = await ssoResponse.json();

        const progress = await fetch('https://api.idn.app/api/v1/tier/progress?n=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'access-token': auth.accessToken,
                'Authorization': `Bearer ${auth.idToken}`,
                'Connection': 'keep-alive',
                'Host': 'api.idn.app',
                'Origin': 'https://www.idn.app',
                'Referer': 'https://www.idn.app/',
                'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'X-API-Key': '123f4c4e-6ce1-404d-8786-d17e46d65b5c'
            },
        });

        const hasil = await progress.json();
        const signOut = await globalSignOut(auth.accessToken);
        const revoke = await revokeToken(auth.refreshToken);
        auth.clearTokens();

        return res.status(200).json({
            loginBySSO: ssoResult,
            progress: hasil,
            logout: signOut.message,
            revoke: revoke.message
        });

    } catch (err) {
        return res.status(500).json({ error: err.message || 'Terjadi kesalahan saat login' });
    }
};
