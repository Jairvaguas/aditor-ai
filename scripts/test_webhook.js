async function run() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/profiles?select=clerk_user_id&limit=1';
    try {
        const res = await fetch(url, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            }
        });
        const data = await res.json();
        console.log("Profiles:", JSON.stringify(data, null, 2));

        if (data && data.length > 0) {
            const testId = data[0].clerk_user_id;
            console.log(`Calling webhooK test with ID: ${testId}`);
            const webhookRes = await fetch(`http://localhost:3000/api/payments/test-webhook?userId=${testId}`);
            const webhookData = await webhookRes.json();
            console.log("Webhook response:", webhookData);
        } else {
            console.log("No profiles found in Supabase 'profiles' table.");
        }
    } catch (error) {
        console.error(error);
    }
}
run();
