FROM eclipse-temurin:21-jre-alpine

# Variables d'environnement Kafka KRaft
ENV KAFKA_VERSION=3.7.0
ENV SCALA_VERSION=2.13
ENV KAFKA_HOME=/opt/kafka
ENV PATH="${KAFKA_HOME}/bin:${PATH}"

# Installation des dépendances minimales et Kafka
RUN apk add --no-cache bash curl tar \
    && curl -fsSL https://downloads.apache.org/kafka/${KAFKA_VERSION}/kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz \
       | tar -xz -C /opt \
    && mv /opt/kafka_${SCALA_VERSION}-${KAFKA_VERSION} ${KAFKA_HOME} \
    && rm -rf /var/cache/apk/*

# Config KRaft
ENV KAFKA_NODE_ID=1
ENV KAFKA_PROCESS_ROLES=broker,controller
ENV KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
ENV KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://bjo-kafka.internal:9092
ENV KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
ENV KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093
ENV KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER
ENV KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
ENV KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1
ENV KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1
ENV KAFKA_AUTO_CREATE_TOPICS_ENABLE=true

VOLUME ["/var/lib/kafka/data"]

WORKDIR ${KAFKA_HOME}

CMD ["sh", "-c", "exec kafka-server-start.sh config/kraft/server.properties \
  --override node.id=$KAFKA_NODE_ID \
  --override process.roles=$KAFKA_PROCESS_ROLES \
  --override listeners=$KAFKA_LISTENERS \
  --override advertised.listeners=$KAFKA_ADVERTISED_LISTENERS \
  --override listener.security.protocol.map=$KAFKA_LISTENER_SECURITY_PROTOCOL_MAP \
  --override controller.quorum.voters=$KAFKA_CONTROLLER_QUORUM_VOTERS \
  --override controller.listener.names=$KAFKA_CONTROLLER_LISTENER_NAMES \
  --override offsets.topic.replication.factor=$KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR \
  --override transaction.state.log.replication.factor=$KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR \
  --override transaction.state.log.min.isr=$KAFKA_TRANSACTION_STATE_LOG_MIN_ISR \
  --override auto.create.topics.enable=$KAFKA_AUTO_CREATE_TOPICS_ENABLE"]
