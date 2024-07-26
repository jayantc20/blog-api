import autocannon from 'autocannon';
import config from "config";

const apiKey = config.get("API_KEY");

function runLoadTest(options) {
    return new Promise((resolve) => {
        autocannon(options, (err, results) => {
            if (err) {
                console.error(`Error during load test for ${options.url}:`, err);
                resolve();
                return;
            }
            console.log(`Load test results for ${options.method} ${options.url}:`);
            console.log(`Requests/sec: ${results.requests.average}`);
            console.log(`Latency (ms): ${results.latency.average}`);
            console.log('-----------------------------');
            resolve(results);
        });
    });
}

// connections: 10, //default
// pipelining: 1, // default
// duration: 10 // default
async function runAllTests() {
    const warmUpOptions = {
        url: 'http://localhost:3000/api/v1/posts/1',
        method: 'GET',
        headers: { 'x-api-key': `${apiKey}` },
        connections: 10,
        pipelining: 1,
        duration: 5
    };

    // Warm-up phase
    console.log('Starting warm-up phase...');
    await runLoadTest(warmUpOptions);
    console.log('Warm-up phase complete.');

    // POST /api/v1/posts - Create a new post
    await runLoadTest({
        url: 'http://localhost:3000/api/v1/posts',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${apiKey}`
        },
        body: JSON.stringify({ title: 'Test Post', content: 'This is a test post.' }),
        // connections: 100,
        // pipelining: 10,
        // duration: 10
    });

    // GET /api/v1/posts/1 - Retrieve a post by ID
    await runLoadTest({
        url: 'http://localhost:3000/api/v1/posts/1',
        headers: { 'x-api-key': `${apiKey}` },
        method: 'GET',
        // connections: 100,
        // pipelining: 10,
        // duration: 10
    });

    // GET /api/v1/posts - List all posts
    await runLoadTest({
        url: 'http://localhost:3000/api/v1/posts',
        headers: { 'x-api-key': `${apiKey}` },
        method: 'GET',
        // connections: 100,
        // pipelining: 10,
        // duration: 10
    });

    // PUT /api/v1/posts/1 - Update a post by ID
    await runLoadTest({
        url: 'http://localhost:3000/api/v1/posts/1',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${apiKey}`
        },
        body: JSON.stringify({ title: 'Updated Title', content: 'Updated content.' }),
        // connections: 100,
        // pipelining: 10,
        // duration: 10
    });

    // DELETE /api/v1/posts/1 - Delete a post by ID
    await runLoadTest({
        url: 'http://localhost:3000/api/v1/posts/1',
        method: 'DELETE',
        headers: { 'x-api-key': `${apiKey}` },
        // connections: 100,
        // pipelining: 10,
        // duration: 10
    });
}

runAllTests();
