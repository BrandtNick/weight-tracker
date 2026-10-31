# weight-tracker
Simple Weight Tracker with time series and statistics

## Local development

Start the application and add the development sample data:

```sh
docker compose up -d
docker compose exec api yarn seed
```

The seed command is safe to run more than once. Sign in with username `test`
and password `test` to view the sample weight history.
