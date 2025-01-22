import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';

const clientId = "374863242736-0dl5i33bj30b0lk8e3m3jglh9471i8k0.apps.googleusercontent.com";

function GLogout() {
    const onLogout = () => {
        googleLogout();
        console.log("Logout success!");
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div>
                <button onClick={onLogout}>Logout</button>
            </div>
        </GoogleOAuthProvider>
    );
}

export default GLogout;
