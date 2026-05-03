import time
import unittest
import os

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By

CATALOGO_URL = os.getenv("FRONTEND_URL", "http://localhost:5173/pesquisa-produtos").rstrip("/")
CARRINHO_URL = os.getenv("FRONTEND_URL", "http://localhost:5173/carrinho").rstrip("/")
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

		# Abrir a página base uma vez para que os testes sequenciais possam operar sobre o mesmo fluxo
		cls.driver.get(CATALOGO_URL + "")
		cls.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
		time.sleep(1)

	@classmethod
	def tearDownClass(cls):
		cls.driver.quit()

	def abrir(self, rota):
		CATALOGO_URL = os.getenv("FRONTEND_URL", "http://localhost:5173/pesquisa-produtos").rstrip("/")
		self.driver.get(f"{CATALOGO_URL}{rota}")
		self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

	def adicionar_produto(self, xpath='//*[@id="root"]/div/div/main/div/div[2]/div/div/div[2]/div/div[1]/div[2]/div[2]/button'):
		botao_adicionar = self.wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
		botao_adicionar.click()

	def adicionar_ao_carrinho(self, xpath='//*[@id="root"]/div/div/main/div/div[2]/div[1]/div[2]/button'):
		botao_carrinho = self.wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
		botao_carrinho.click()
  
	def adicionar_mais_produto(self, xpath='//*[@id="root"]/div/div/main/div/div/div[2]/div[1]/div/div[2]/div/div[2]/div[2]/div[1]/button[2]'):
		botao_adicionar = self.wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
		botao_adicionar.click()
		time.sleep(1)
		botao_adicionar.click()
	
  
	def remover_produto(self, xpath='//*[@id="root"]/div/div/main/div/div/div[2]/div[1]/div/div[2]/div/div[2]/div[2]/div[1]/button[1]'):
		botao_remover = self.wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
		botao_remover.click()
		time.sleep(1)
		botao_remover.click()
		

	def preencher_cep(self, xpath='//*[@id="root"]/div/div/main/div/div/div[2]/div[2]/div[1]/div[3]/input'):
		campo_cep = self.wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
		campo_cep.clear()
		campo_cep.send_keys("09271260")
  
	def calcular_frete(self, xpath='//*[@id="root"]/div/div/main/div/div/div[2]/div[2]/div[1]/div[3]/button'):
		botao_calcular = self.wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
		botao_calcular.click()
  

	def test_01_adicionar_produto(self):
		"""Clique no botão de adicionar na página de detalhes."""
		self.adicionar_produto()
		time.sleep(1)

	def test_02_adicionar_produto_ao_carrinho(self):
		"""Clique em 'adicionar ao carrinho' (assume que estamos na página de detalhes)."""
		self.adicionar_ao_carrinho()
		time.sleep(1)

	def test_03_aumentar_quantidade_itens(self):
		"""Aumenta a quantidade de itens no carrinho clicando '+' duas vezes."""
		self.adicionar_mais_produto()
		time.sleep(1)

	def test_04_remover_itens_do_carrinho(self):
		"""Remove itens do carrinho clicando '-' duas vezes."""
		self.remover_produto()
		time.sleep(1)

	def test_05_preencher_cep_frete(self):
		"""Preenche o campo de CEP para cálculo de frete."""
		self.preencher_cep()
		time.sleep(1)

	def test_06_calcular_frete(self):
		"""Clica no botão para calcular o frete."""
		self.calcular_frete()
		time.sleep(1)


if __name__ == "__main__":
	unittest.main()