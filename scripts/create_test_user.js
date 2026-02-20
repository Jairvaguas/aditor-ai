async function run() {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
        console.error('CLERK_SECRET_KEY not found in .env.local');
        return;
    }

    const email = 'yakkoir@msn.com';
    const password = 'Aditorai2026+';

    try {
        console.log('--- Buscando usuario existente... ---');
        const getRes = await fetch(`https://api.clerk.com/v1/users?email_address=${email}`, {
            headers: { 'Authorization': `Bearer ${secretKey}` }
        });

        const users = await getRes.json();

        if (users && users.length > 0) {
            const userId = users[0].id;
            console.log(`El usuario ya existe (ID: ${userId}). Actualizando contraseña...`);
            const updateRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${secretKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: password })
            });
            const updateData = await updateRes.json();
            console.log('Update result:', updateData.id ? 'Succcess' : updateData);
        } else {
            console.log('--- Usuario no encontrado. Creando nuevo usuario... ---');
            const createRes = await fetch('https://api.clerk.com/v1/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${secretKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email_address: [email],
                    password: password,
                    first_name: 'Meta',
                    last_name: 'Reviewer',
                    skip_password_checks: true,
                    skip_password_requirement: true
                })
            });

            const createData = await createRes.json();
            console.log('Create result:', createData.id ? 'Success' : createData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
run();
