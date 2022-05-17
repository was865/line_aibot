from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
# from chatterbot import languages  # 言語モジュール
import languages  # 自作言語モジュール

jsonData = sys.stdin.readline()  # ①データはこうやって読み込むらしいがテキスト形式になっているので注意！
json_dict = json.loads(jsonData)

bot = ChatBot(
    name='ボット',
    tagger_language=languages.JPN  # 統計モデルの言語指定
    # tagger_language=languages.GINZA  # GINZAモデルの場合
)

# trainer = ChatterBotCorpusTrainer(bot)

# trainer.train(
#         'chatterbot.corpus.japanese' # 日本語用コーパス
# )

try:
    input_data = json_dict["input_text"]
    response = bot.get_response(input_data)
    print('{}: {}'.format(bot.name, response))
except(KeyboardInterrupt, EOFError, SystemExit):
    print('error.')
