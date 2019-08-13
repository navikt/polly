set -e

BINARY_URL='https://github.com/AdoptOpenJDK/openjdk11-binaries/releases/download/jdk-11.0.4%2B11/OpenJDK11U-jdk_x64_linux_hotspot_11.0.4_11.tar.gz'
ESUM='90c33cf3f2ed0bd773f648815de7347e69cfbb3416ef3bf41616ab1c4aa0f5a8'

# From AdoptOpenJDK dockerfile
curl -LfsSo /tmp/openjdk.tar.gz ${BINARY_URL}
echo "${ESUM} */tmp/openjdk.tar.gz" | sha256sum -c -
mkdir -p ${JAVA_HOME}
cd ${JAVA_HOME}
tar -xf /tmp/openjdk.tar.gz --strip-components=1
rm -rf /tmp/openjdk.tar.gz