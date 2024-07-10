FROM public.ecr.aws/lambda/python:3.11

ENV NLTK_DATA=/tmp/llama_index_nltk_cache
ENV TIKTOKEN_CACHE_DIR=/tmp/llama_index_tiktoken_cache

COPY index.py	requirements.txt __init__.py llamaindex_utils.py open-sqlite.py ./

# https://docs.trychroma.com/troubleshooting#sqlite
RUN yum install -y make configure gcc tcl
RUN curl https://www.sqlite.org/src/tarball/sqlite.tar.gz?r=release -o sqlite.tar.gz
RUN python ./open-sqlite.py && \
    cd sqlite/ && \
    ./configure && \
    make sqlite3.c && \
    make install

RUN python3.11 -m pip install pysqlite3-binary

RUN python3.11 -m pip install -r requirements.txt -t .
RUN python3.11 -m nltk.downloader punkt -d /tmp/llama_index_nltk_cache
RUN python3.11 -m nltk.downloader stopwords -d /tmp/llama_index_nltk_cache

# Command can be overwritten by providing a different command in the template directly.
CMD ["index.lambda_handler"]
