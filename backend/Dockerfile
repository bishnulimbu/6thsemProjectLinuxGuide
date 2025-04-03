FROM ubuntu:20.04

# Install basic utilities and common tools
RUN apt-get update && apt-get install -y \
    bash \
    coreutils \
    nano \
    vim \
    grep \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Create a mock apt command for educational purposes
RUN echo '#!/bin/bash\nif [[ "$1" == "install" ]]; then echo "Simulating installation of $2... Done."; elif [[ "$1" == "update" ]]; then echo "Simulating apt update... Done."; else echo "apt: command not fully supported in this sandbox."; fi' > /usr/bin/apt \
    && chmod +x /usr/bin/apt

# Create a non-root user for safety
RUN useradd -m -s /bin/bash sandboxuser
USER sandboxuser
WORKDIR /home/sandboxuser

CMD ["/bin/bash"]
