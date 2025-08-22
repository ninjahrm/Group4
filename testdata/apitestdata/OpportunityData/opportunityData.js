import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

export function generateOpportunityData() {
  const empName = faker.person.fullName();
const email = `user${Date.now()}@example.com`.toLowerCase();
 const username = faker.internet.username().replace(/[^\w]/g, '').slice(0, 15); // alphanumeric max 15 chars


   const mobileNo = '9' + Date.now().toString().slice(-9);
  const password = faker.internet.password({ length: 12, symbols: true, memorable: true });
  const data = {
    userCreateData: {
      department: "Dept",
      designation: "Des",
      dob: faker.date.past({ years: 30 }).toISOString().split('T')[0],
      email: email,
      empName: empName,
      experience: faker.number.int({ min: 1, max: 15 }),
      mobileNo: mobileNo,
      role: "Lead",
      username: username,
      password: password
    },
    urls: {
      baseUrl: "http://49.249.28.218:8098",
      endpoint: "/admin/create-user"
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from("rmgyantra:rmgy@9999").toString("base64")
    }
  };

  // Save username/password to a JSON file

  // Ensure folder exists
  const dirPath = path.join(process.cwd(), 'testdata/apitestdata/OpportunityData');
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  // File path
  const savePath = path.join(dirPath, 'generatedUser.json');

  // Save username/password
  fs.writeFileSync(savePath, JSON.stringify({ username, password }, null, 2));

  return { data, savePath }; // return both payload and saved file path
}


