import NavBar from '../features/navbar/Navbar';
import UserProfile from '../features/user/Components/UserProfile';

function UserProfilePage() {
  return (
    <div>
      <NavBar>
        <h1 className='mx-auto text-2xl'>My Profile</h1>
        <UserProfile/>
      </NavBar>
    </div>
  );
}

export default UserProfilePage;