interface PasswordEntry {
    id: string;
    website: string;
    username: string;
    password: string;
  }
  
  export default function PasswordList({ passwords }: { passwords: PasswordEntry[] }) {
    return (
      <div className="border rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Website</th>
              <th className="text-left p-2">Username</th>
              <th className="text-left p-2">Password</th>
            </tr>
          </thead>
          <tbody>
            {passwords.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="p-2">{entry.website}</td>
                <td className="p-2">{entry.username}</td>
                <td className="p-2 font-mono">{entry.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }