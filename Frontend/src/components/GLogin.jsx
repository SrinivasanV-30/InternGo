import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const jwt_decode = import('jwt-decode').then((module) => module.default);

const clientId = "374863242736-0dl5i33bj30b0lk8e3m3jglh9471i8k0.apps.googleusercontent.com";

function GLogin() {
    const navigate = useNavigate();

    const onSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse; 
        console.log("Credential Response: ", credential);

        try {
            const decode = await jwt_decode;
            const decodedData = decode(credential);  
            console.log("Decoded User Data: ", decodedData); 

            const { email, name, picture } = decodedData;

            // Validate email domain
            const allowedDomain = "finestcoder.com";
            if (email.split('@')[1] !== allowedDomain) {
                alert("Authentication failed: Only @finestcoder.com email addresses are allowed.");
                return; 
            }

            // Simulate a backend API call for additional validation and role/permission assignment
            const response = await axios.post('/api/auth/oauth', { name,email,picture });
            const user = response.data?.data;
            console.log(user);
            

            if (user?.token) {
                // Store token securely
                localStorage.setItem("token", user.token);
                document.cookie = `token=${user.token}; path=/; secure; HttpOnly; max-age=3600`;

                // Store roles and permissions locally
                localStorage.setItem('roles', JSON.stringify(user.role));
                localStorage.setItem('permissions', JSON.stringify(user.permissions));

                alert("Sign In Successful!");
                console.log("Authentication successful! Name:", name, "Email:", email, "Picture:", picture);
                navigate('/dashboard');
            } else {
                alert("Authentication failed: Unable to retrieve user details.");
            }
        } catch (error) {
            console.error("Error during authentication:", error);
            alert("Authentication failed: Please try again.");
        }
    };

    const onFailure = () => {
        console.log("Login failed!");
        alert("Google Sign-In failed. Please try again.");
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                />
            </div>
        </GoogleOAuthProvider>
    );
}

export default GLogin;
