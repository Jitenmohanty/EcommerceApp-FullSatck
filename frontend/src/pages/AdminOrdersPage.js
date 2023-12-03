import AdminOrders from "../features/admin/Components/AdminOrders";
import NavBar from "../features/navbar/Navbar";

function AdminOrdersPage() {
    return ( 
        <div>
            <NavBar>
                <AdminOrders></AdminOrders>
            </NavBar>
        </div>
     );
}

export default AdminOrdersPage;