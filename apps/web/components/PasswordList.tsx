interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password: string;
}

export default function PasswordList({ passwords }: { passwords: PasswordEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3 font-medium text-gray-700">Website</th>
            <th className="text-left p-3 font-medium text-gray-700">Username</th>
            <th className="text-left p-3 font-medium text-gray-700">Password</th>
          </tr>
        </thead>
        <tbody>
          {passwords.map((entry) => (
            <tr 
              key={entry.id} 
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="p-3 text-gray-800">{entry.website}</td>
              <td className="p-3 text-gray-800">{entry.username}</td>
              <td className="p-3 font-mono text-red-600">{entry.password}</td>
            </tr>
          ))}
          {passwords.length === 0 && (
            <tr>
              <td 
                colSpan={3} 
                className="p-3 text-center text-gray-500"
              >
                No passwords found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}