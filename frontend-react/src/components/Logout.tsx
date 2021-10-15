import { useAuth } from '../contexts/AuthContext';

export default function Logout() {
    const {logout, user} = useAuth();

    const onLogoutClick = async () => {
        await logout();
    }

    return (
        <div>
           {user && <button onClick={onLogoutClick}>logout</button> }
           {user?.photoURL && <img src={user.photoURL} alt=""/>}
        </div>
    )
}
