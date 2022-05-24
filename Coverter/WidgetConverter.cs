//  using System;
//  using System.Text.Json;
//  using Model.PageModel;
//  using Model.PageModel.PageWidget;
//  using Model.PageModel.PageWidget.WidgetContent;
//  using Newtonsoft.Json;
//  using JsonException = System.Text.Json.JsonException;
//  using JsonSerializer = System.Text.Json.JsonSerializer;

//  namespace Converter
//  {
//      public class ContentConverter : System.Text.Json.Serialization.JsonConverter<Widget>
//      {
//          public override bool CanConvert(Type typeToConvert) =>
//              typeof(Widget).IsAssignableFrom(typeToConvert);

//          public override Widget Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
//          {
//              Utf8JsonReader readerClone = reader;

//              if (readerClone.TokenType != JsonTokenType.StartObject)
//              {
//                  throw new JsonException();
//              }

//              readerClone.Read();
//              if (readerClone.TokenType != JsonTokenType.PropertyName)
//              {
//                  throw new JsonException();
//              }

//              string? propertyName = readerClone.GetString();
//              if (propertyName != "Type")
//              {
//                  throw new JsonException();
//              }

//              readerClone.Read();
//              if (readerClone.TokenType != JsonTokenType.Number)
//              {
//                  throw new JsonException();
//              }

//              WidgetType typeDiscriminator = (WidgetType)readerClone.GetInt32();
//              Content content = typeDiscriminator switch
//              {
//                  WidgetType.Text => JsonSerializer.Deserialize<HtmlConfiguration>(ref reader),
//                  WidgetType.Gallery => JsonSerializer.Deserialize<GalleryConfiguration>(ref reader),
//                  WidgetType.Video => JsonSerializer.Deserialize<VideoConfiguration>(ref reader),
//                  WidgetType.Pdf => JsonSerializer.Deserialize<BaseMediaConfiguration>(ref reader),
//                  WidgetType.Tour => JsonSerializer.Deserialize<ShowcaseConfiguration>(ref reader),
//                  WidgetType.Map => JsonSerializer.Deserialize<MapConfiguration>(ref reader),
//                  WidgetType.WebPage => JsonSerializer.Deserialize<BaseMediaConfiguration>(ref reader),
//                  WidgetType.HorizontalScrollGallery => JsonSerializer.Deserialize<BaseMediaConfiguration>(ref reader),
//                  WidgetType.GridGallery => JsonSerializer.Deserialize<BaseMediaConfiguration>(ref reader),
//                  _ => throw new JsonException()
//              };

//              return content;

//          }

//          public override void Write(Utf8JsonWriter writer, Widget widget, JsonSerializerOptions options)
//          {
//             JsonSerializer.Serialize(writer, widget, widget.GetType(), options);
//          }
//      }
//  }