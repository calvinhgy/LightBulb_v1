#!/bin/bash

if [ -f server.pid ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null; then
        echo "Stopping server with PID $PID"
        kill $PID
        rm server.pid
        echo "Server stopped"
    else
        echo "Server is not running. Removing stale PID file."
        rm server.pid
    fi
else
    echo "No server PID file found. Server is not running."
fi
