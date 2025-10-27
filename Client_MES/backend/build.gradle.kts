import java.io.File

plugins {
	java
	id("org.springframework.boot") version "3.5.3"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.clientmes"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-cache")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-websocket")
	implementation("com.github.ben-manes.caffeine:caffeine:3.1.8")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
	implementation("org.mapstruct:mapstruct:1.5.5.Final")
	compileOnly("org.projectlombok:lombok")
	runtimeOnly("com.h2database:h2")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

val keystorePath = "src/main/resources/keystore.p12"
val keystorePassword = "changeit"
val keystoreAlias = "mes-local"
val crtPath = "src/main/resources/mes-local.crt"

tasks.register("generateKeystore") {
    group = "build setup"
    description = "Génère un keystore auto-signé pour HTTPS si absent"
    doLast {
        val file = File(keystorePath)
        val crtFile = File(crtPath)
        if (!file.exists()) {
            println("Génération du keystore auto-signé pour HTTPS ($keystorePath)")
            exec {
                commandLine(
                    "keytool", "-genkeypair",
                    "-alias", keystoreAlias,
                    "-keyalg", "RSA",
                    "-keysize", "2048",
                    "-storetype", "PKCS12",
                    "-keystore", keystorePath,
                    "-validity", "3650",
                    "-storepass", keystorePassword,
                    "-keypass", keystorePassword,
                    "-dname", "CN=localhost, OU=Dev, O=ClientMES, L=Local, S=Local, C=FR"
                )
            }
        } else {
            println("Keystore déjà présent : $keystorePath")
        }
		 // Génère le certificat public si absent ou si le keystore vient d'être créé
        if (!crtFile.exists() || file.lastModified() > crtFile.lastModified()) {
            println("Extraction du certificat public vers $crtPath")
            exec {
                commandLine(
                    "keytool", "-exportcert",
                    "-alias", keystoreAlias,
                    "-keystore", keystorePath,
                    "-storepass", keystorePassword,
                    "-file", crtPath,
                    "-rfc"
                )
            }
        } else {
            println("Certificat public déjà présent : $crtPath")
        }

		val keyPath = "src/main/resources/mes-local.key"
		val keyFile = File(keyPath)
		if (!keyFile.exists() || file.lastModified() > keyFile.lastModified()) {
			println("Extraction de la clé privée vers $keyPath")
			exec {
				commandLine(
					"openssl", "pkcs12",
					"-in", keystorePath,
					"-nocerts",
					"-out", keyPath,
					"-nodes",
					"-passin", "pass:$keystorePassword"
				)
			}
		} else {
			println("Clé privée déjà présente : $keyPath")
		}
    }
}
tasks.register("copyCertToFrontend") {
    group = "build setup"
    description = "Copie le certificat public dans le frontend"
    dependsOn("generateKeystore")
    doLast {
        val src = File("src/main/resources/mes-local.crt")
        val dest = File("../frontend/certs/mes-local.crt")
        src.copyTo(dest, overwrite = true)
        println("Certificat copié dans le frontend : $dest")

		val keyPath = "src/main/resources/mes-local.key"
		val keyDest = File("../frontend/certs/mes-local.key")
		File(keyPath).copyTo(keyDest, overwrite = true)
		println("Clé privée copiée dans le frontend : $keyDest")
    }
}
// On rend la tâche processResources dépendante de la génération du keystore
tasks.named("processResources") {
    dependsOn("generateKeystore")
}
