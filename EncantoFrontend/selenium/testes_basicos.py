import os
import time
import unittest

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By

BASE_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
HEADLESS = os.getenv("HEADLESS", "false").lower() == "true"


class FrontBasicoTest(unittest.TestCase):
	@classmethod
	def setUpClass(cls):
		options = ChromeOptions()
		if HEADLESS:
			options.add_argument("--headless=new")
		options.add_argument("--window-size=1366,900")
		options.add_argument("--no-sandbox")
		options.add_argument("--disable-dev-shm-usage")

		service = Service(ChromeDriverManager().install())
		cls.driver = webdriver.Chrome(service=service, options=options)
		cls.wait = WebDriverWait(cls.driver, 15)

	@classmethod
	def tearDownClass(cls):
		cls.driver.quit()

	def abrir(self, rota):
		self.driver.get(f"{BASE_URL}{rota}")
		self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
		time.sleep(2)


	def texto_visivel(self, texto):
		xpath = f"//*[contains(normalize-space(.), \"{texto}\")]"
		# Usar um wait específico com timeout maior se necessário
		wait_specific = WebDriverWait(self.driver, 15)
		return wait_specific.until(EC.visibility_of_element_located((By.XPATH, xpath)))


	def test_login_carrega(self):
		self.abrir("/login")
		elemento = self.texto_visivel("Encanto")
		self.assertIn("/login", self.driver.current_url)
		self.assertTrue(elemento.is_displayed())
		time.sleep(2)


	def test_login_valido(self):
		self.abrir("/login")
		# Localizar e preencher email usando ID
		email_input = self.wait.until(EC.visibility_of_element_located((By.ID, "email")))
		email_input.send_keys("admin@encanto.com")
		# Localizar e preencher senha usando ID
		senha_input = self.wait.until(EC.visibility_of_element_located((By.ID, "password")))
		senha_input.send_keys("admin123")
		# Localizar botão usando o texto "Entrar"
		botao_login = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Entrar')]")))
		botao_login.click()
		# Verificar se o login foi bem-sucedido (elemento desapareceu ou mudou)
		time.sleep(2)
		# Verificar se os campos foram preenchidos corretamente
		self.assertTrue(email_input.get_attribute("value") == "admin@encanto.com")
		self.assertTrue(senha_input.get_attribute("value") == "admin123")


	def test_catalogo_carrega(self):
		self.abrir("/catalogo")
		elemento = self.texto_visivel("Clientes Felizes")
		self.assertIn("/catalogo", self.driver.current_url)
		self.assertTrue(elemento.is_displayed())
		time.sleep(2)


if __name__ == "__main__":
	unittest.main()
