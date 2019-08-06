### Prerequisites:
1. You need to add Mongo initialization credentials to `~/exc_svc/sec` directory. The file should be called `credentials.js` - use one in `sample_files/exc_svc/sec` as a reference. 
Only change name and password or else Mongo setup script won't be able to pick up credentials.

2. Create directory for file storage at `~/exc_svc/storage`.

3. Add Mongo config to `~/exc_svc/sec`. The file should be called `credentials.json`. Use one in `sample_files/exc_svc/sec` as a reference.
Only change user name and password to match with the ones in `credentials.js`, don't change DB name or URL. 

4. Create directory for Mongo files at `~/exc_svc/mongo/data`.

5. If running on Mac, make sure you're running Docker from Edge channel with experimental settings, because Mongo has troubles accessing mounted volumes with stable Docker.

### Starting the service:
To start the service, you can run either `start.sh` or `start_full_rebuild.sh`.
The only difference is that `start_full_rebuil.sh` will rebuild all Docker images.
Use it only if you made changes to code. 

After starting up the server will be running on port 4555. You can edit the port in `docker-compose.yml`. 