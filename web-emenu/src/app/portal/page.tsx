export default function PortalHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Restaurant Management Portal</h1>
      <p className="text-gray-600 mt-2">Welcome! Use the sidebar to navigate.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Branches</h2>
          <p className="text-sm text-gray-600">Manage locations and settings</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Menu & Items</h2>
          <p className="text-sm text-gray-600">Create and update menu items</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Orders</h2>
          <p className="text-sm text-gray-600">Track incoming orders</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Staff</h2>
          <p className="text-sm text-gray-600">Manage staff and roles</p>
        </div>
      </div>
    </div>
  );
}