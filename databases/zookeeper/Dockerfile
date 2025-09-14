FROM zookeeper:3.9

# Variables d'environnement pour un mode standalone simple
ENV ZOO_STANDALONE_ENABLED=true \
    ZOO_ADMINSERVER_ENABLED=false \
    ZOO_4LW_COMMANDS_WHITELIST=ruok,stat,conf

# Le volume /data est déjà prévu dans l'image officielle
VOLUME ["/data"]

# Port par défaut
EXPOSE 2181

# Commande de démarrage par défaut (déjà incluse dans l'image)
