#!/usr/bin/env bash

node build.js
mkdir -p dist/build/Release
cp node_modules/bigint-buffer/build/Release/bigint_buffer.node dist/build/Release/bigint_buffer.node
