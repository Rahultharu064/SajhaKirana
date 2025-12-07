function Settings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="site-title" className="block text-sm font-medium mb-2">Site Title</label>
          <input id="site-title" type="text" defaultValue="SajhaKirana" placeholder="Enter site title" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium mb-2">Email</label>
          <input id="admin-email" type="email" defaultValue="admin@sajhakirana.com" placeholder="admin@email.com" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium mb-2">Timezone</label>
          <select id="timezone" className="border p-2 rounded w-full">
            <option>UTC</option>
            <option>Asia/Katmandu</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Save Settings</button>
      </div>
    </div>
  );
}

export default Settings;
