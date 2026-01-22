import app from "./src/app";
import { ConnectDB } from "./src/config/database";
import 'dotenv/config';



const PORT = process.env.PORT || 3000;

ConnectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is Running on ${PORT}`)
        });
    })
    .catch((err) => {
        console.log('Failed to Connect with th server', err);
        process.exit(1);
    });